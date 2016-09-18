const esprima = require('esprima'),
    doctrine = require('doctrine'),
    commands = [];

let
    options = '',
    descriptions = [];

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
    commands[property.key.name] = {
        params: readAnnotations(property),
        options: readOptions(property),
        description: readDescription(property)
    };
}

function readCtorOptions(stmt) {
    let jsDoc = property.leadingComments[0].value,
        paramDesc = doctrine.parse(`/*${jsDoc}*/`, { unwrap: true, tags: ['arg'], sloppy: true }),
        params = [];

    return paramDesc.tags
        .reduce((params, paramTag) => {
            params[paramTag.name] = {
                alias: createAlias(paramTag.name.toLowerCase()),
                description: paramTag.description,
                optional: paramTag.type.type === 'OptionalType',
                'default': paramTag.default
            };
            return params;
        }, {});
}

function readAppName(stmt) {
    return stmt.argument.id.name;
}

module.exports = function readConstructor(ctor) {
    let ctorStr = ctor.toString(),
        ctorParseTree = esprima.parse(ctorStr, { attachComment: true }),
        ctorReturns = ctorParseTree.body[0].body.body.filter(stmt => stmt.type === 'ReturnStatement'),
        ctorOptions;

    ctorReturns.forEach(returnStmt => {
        descriptions.push(readDescription(returnStmt));

        ctorOptions = readOptions(returnStmt);

        returnStmt.argument.body.body.filter(stmt => stmt.type === 'ReturnStatement').forEach(returnStmt2 => {
            returnStmt2.argument.properties.forEach(readProperty);
        });
    });

    return {
        description: descriptions.join('\n\n'),
        options: ctorOptions,
        commands
    };
};
