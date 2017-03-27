'use strict';

var commandLineArgs = require('command-line-args');
var getUsage = require('command-line-usage');
var fs = require('fs');

function FileDetails(filename){
    if (!(this instanceof FileDetails)) return new FileDetails(filename);
    this.filename = filename;
    this.exists = fs.existsSync(filename);
}

var optionDefinitions = [
    {
        name: 'verbose',
        alias: 'v',
        description: 'Show debug log.',
        type: Boolean
    },
    {
        name: 'dump',
        alias: 'd',
        typeLabel: '[underline]{folder}',
        description: 'Dump decrypted packets in specified folder',
        type: FileDetails
    },
    {
        name: 'replay',
        alias: 'r',
        typeLabel: '[underline]{file}',
        description: 'Replay a dumped packet.',
        type: FileDetails,
    },
    {
        name: 'help',
        alias: 'h',
        description: 'Print this usage guide.',
        type: Boolean
    }
];

var sections = [
    {
        header: 'Royale Proxy',
        content: 'A simple Clash Royale proxy.'
    },
    {
        header: 'Synopsis',
        content: [
            '$ node index [[bold]{--verbose}] [[bold]{--dump} [underline]{./packets/}]',
            '$ node index --help'
        ]
    },
    {
        header: 'Options',
        optionList: optionDefinitions
    },
    {
        content: [
            'Visit us at [underline]{http://github.com/royale-proxy}',
            '',
            ' _______                   __       _______                        ',
            '|   _   .-----.--.--.---.-|  .-----|   _   .----.-----.--.--.--.--.',
            '|.  l   |  _  |  |  |  _  |  |  -__|.  1   |   _|  _  |_   _|  |  |',
            '|.  _   |_____|___  |___._|__|_____|.  ____|__| |_____|__.__|___  |',
            '|:  |   |     |_____|              |:  |                    |_____|',
            '|::.|:. |                          |::.|                           ',
            '`--- ---\'                          `---\'                           '
        ],
        raw: true
    }
];

var options = commandLineArgs(optionDefinitions);
var usage = getUsage(sections);

if(options.help) {
    console.log(usage);
    process.exit(0);
}

if(options.dump === null || (options.dump && !options.dump.exists)) {
    console.error('Error: Specified path does not exist. Please check the path and try again.');
    console.log(usage);
    process.exit(1);
}

if(options.replay === null || (options.replay && !options.replay.exists)) {
    console.error('Error: Specified filename does not exist. Please check the filename and try again.');
    console.log(usage);
    process.exit(1);
}

module.exports.options = options;
