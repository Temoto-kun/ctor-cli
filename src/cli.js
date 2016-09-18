const
    Program = require('commander'),
    process = require('process'),
    parseCli = require('./parse'),
    registeredOptions = [];

function createCommandString(commandName, command) {
    Object.keys(command.params).forEach(paramName => {
        commandName += ` <${paramName}>`;
    });

    return commandName;
}

function createOptionString(optionName, option) {
    let optionStr = `${option.alias}, --${optionName}`;

    if (option.optional) {
        return optionStr += ' [value]';
    }

    return optionStr += ' <value>';
}

function filterOptions(optionsObj) {
    let filteredOptions = {};

    registeredOptions.forEach(option => {
        filteredOptions[option] = optionsObj[option];
    });

    return filteredOptions;
}

function registerOptions(program, options) {
    Object.keys(options).forEach(optionName => {
        let option = options[optionName];
        program.option(createOptionString(optionName, option), option.description, option['default']);
        registeredOptions.push(optionName);
    });
}

module.exports = function (ctor, version, args) {
    let programDetails = parseCli(ctor),
        programInstance;

    Program
        .version(version || '0.0.0')
        .description(programDetails.description);

    registerOptions(Program, programDetails.options);
    programInstance = ctor()(filterOptions(Program));

    Object.keys(programDetails.commands).forEach(commandName => {
        let command = programDetails.commands[commandName],
            programCommand = Program.command(createCommandString(commandName, command));

        registerOptions(programCommand, command.options);

        programCommand.action(programInstance[commandName]);
    });

    Program.parse(args || []);
}
