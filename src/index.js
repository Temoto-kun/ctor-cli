const esprima = require('esprima'),
    doctrine = require('doctrine'),
    commands = [];

let
    options = '';

function readAnnotations(property) {
    let jsDoc = property.leadingComments[0].value,
        paramDesc = doctrine.parse(`/*${jsDoc}*/`, { unwrap: true, tags: ['param'] }),
        params = [];

    return paramDesc.tags
        .filter(paramTag => paramTag.name !== 'options')
        .reduce((params, paramTag) => {
            params[paramTag.name] = {
                description: paramTag.description
            };
            return params;
        }, {});
}

function createAlias(optionName) {
    let i;

    for (i = 0; i < optionName.length; i++) {
        if (options.indexOf(optionName[i]) < 0) {
            options += optionName[i];
            return `-${optionName[i]}`;
        }
    }

    if (optionName.toUpperCase() === optionName) {
        optionName = optionName.toLowerCase();
        return `--${optionName}`;
    }

    return createAlias(optionName.toUpperCase());
}

function readOptions(property) {
    let jsDoc = property.leadingComments[0].value,
        paramDesc = doctrine.parse(`/*${jsDoc}*/`, { unwrap: true, tags: ['arg'], sloppy: true }),
        params = [];

    return paramDesc.tags
        .reduce((params, paramTag) => {
            params[paramTag.name] = {
                name: paramTag.name,
                alias: createAlias(paramTag.name.toLowerCase()),
                description: paramTag.description,
                optional: paramTag.type.type === 'OptionalType',
                'default': paramTag.default
            };
            return params;
        }, {});
}

function readDescription(property) {
    let jsDoc = property.leadingComments[0].value;

    return doctrine.parse(`/*${jsDoc}*/`, { unwrap: true })
        .description;
}

function readProperty(property) {
    commands.push({
        name: property.key.name,
        params: readAnnotations(property),
        options: readOptions(property),
        description: readDescription(property)
    });
}

module.exports = function readConstructor(ctor) {
    let ctorStr = ctor.toString(),
        ctorParseTree = esprima.parse(ctorStr, { attachComment: true }),
        ctorReturns = ctorParseTree.body[0].body.body.filter(stmt => stmt.type === 'ReturnStatement'),
        description = '';

    ctorReturns.forEach(returnStmt => {
        returnStmt.argument.properties.forEach(readProperty);
    });

    return commands;
};
