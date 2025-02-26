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
    verb: 'venir', 
    translation: 'Venir', 
    conjugations: { 
        present: {
            je: 'viens',
            tu: 'viens',
            il: 'vient',
            nous: 'venons',
            vous: 'venez',
            ils: 'viennent',
        }
    }
}

const cases = [
    { verb: 'venir', translation: 'venir' },
    { verb: 'devenir', translation: 'devenir' },
    { verb: 'prévenir', translation: 'prevenir' },
    // { verb: 'entreprendre', translation: 'emprender' },
    // { verb: 'comprendre', translation: 'comprender' },
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
    let instance = template
        .slice()
        .replaceAll(/{verb}/g, capitalCase(replaceObject.verb))
        .replaceAll(/{translation}/g, capitalCase(replaceObject.translation));

    ['je', 'tu', 'il', 'nous', 'vous', 'ils']
        .forEach(item => {
            const regex = new RegExp(`{${item}}`, 'g');
            const replacement = capitalCase(replaceObject.conjugations.present[item]);
            instance = instance.replaceAll(regex, replacement);
        })

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