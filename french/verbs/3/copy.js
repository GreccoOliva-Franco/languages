const fs = require('fs');
const path = require('path');

const template = '# {verb}\n\n\
{translation}\n\n\
## Indicatif\n\n\
### Present\n\n\
|Pronom|{verb}|\n\
|-|-|\n\
|Je|{je}|\n\
|Tu|{tu}|\n\
|Il/Elle|{il}|\n\
|Nous|{nous}|\n\
|Vous|{vous}|\n\
|Ils/Elles|{ils}|\
'
const root = { 
    verb: 'prendre', 
    translation: 'Llevar / tomar', 
    conjugations: { 
        present: {
            je: 'prends',
            tu: 'prends',
            il: 'prend',
            nous: 'prenons',
            vous: 'prenez',
            ils: 'prennent',
        }
    }
}

const cases = [
    { verb: 'apprendre', translation: 'aprender' },
    { verb: 'surprendre', translation: 'sorprender' },
    { verb: 'entreprendre', translation: 'emprender' },
    { verb: 'comprendre', translation: 'comprender' },
]

function capitalCase(input) {
    return input.slice(0,1).toUpperCase() + input.slice(1);
}

function addPrefixToRootObject(root, prefix, translation) {
    return { 
        verb: prefix + root.verb, 
        translation, 
        conjugations: { 
            present: Object.fromEntries(
                Object
                    .entries(root.conjugations.present)
                    .map(([prenom, value]) => [prenom, prefix + value])
            )
        }
    }
}

function getSimilarCaseReplacementObject(similarCase) {
    const prefix = similarCase.verb.replace(root.verb, '');

    return addPrefixToRootObject(root, prefix, similarCase.translation)
}

function getReplacedTemplateInstance(replaceObject) {
    const instance = template
        .slice()
        .replaceAll(/{verb}/g, capitalCase(replaceObject.verb))
        .replaceAll(/{translation}/g, capitalCase(replaceObject.translation))
        .replaceAll(/{je}/g, capitalCase(replaceObject.conjugations.present.je))
        .replaceAll(/{tu}/g, capitalCase(replaceObject.conjugations.present.tu))
        .replaceAll(/{il}/g, capitalCase(replaceObject.conjugations.present.il))
        .replaceAll(/{nous}/g, capitalCase(replaceObject.conjugations.present.nous))
        .replaceAll(/{vous}/g, capitalCase(replaceObject.conjugations.present.vous))
        .replaceAll(/{ils}/g, capitalCase(replaceObject.conjugations.present.ils))

    return { verb: replaceObject.verb, template: instance };
}

async function writeFile({ verb, template }) {
    const fileName = "./french/verbs/3/" + verb + ".md"
    const fileDir = path.join(process.cwd(), fileName)
    
    await fs.promises.writeFile(fileDir, template);
}

function processTemplateCases(template, root, similarCases) {
    similarCases
        .map(getSimilarCaseReplacementObject)
        .map(getReplacedTemplateInstance)
        .forEach(writeFile)
};

processTemplateCases(template, root, cases);