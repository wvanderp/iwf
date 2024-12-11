/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-useless-path-segments */
import {
    Alias,
    Description,
    getToken,
    Item,
    Label,
    requestItem,
    Statement,
    upload
} from '../../../../src/';
import { Token } from '../../../../src/utils/api/token';

import {
    exampleCommonsMediaSnak,
    exampleExternalIdSnak,
    exampleGeoShapeSnak,
    exampleGlobeCoordinateSnak,
    exampleMathSnak,
    exampleMonolingualTextSnak,
    exampleMusicalNotationSnak,
    exampleQuantitySnak,
    exampleStringSnak,
    exampleTabularDataSnak,
    exampleTimeSnak,
    exampleUrlSnak,
    exampleWikibaseItemSnak,
    exampleWikibasePropertySnak
} from '../../../unit/testUtils/examples/snaks';

declare global {
    interface Window {
        uploadTestPart1: (username: string, password: string) => Promise<void>;
        uploadTestPart2: (username: string, password: string) => Promise<void>;
        uploadTestPart3: (username: string, password: string) => Promise<void>;
    }
}

const testServer = 'https://test.wikidata.org';
const testItem = 'Q231400';

function getTokenForTest(username: string, password: string): Promise<Token> {
    return getToken(
        username,
        password,
        {
            server: testServer
        }
    );
}

async function uploadTestPart1(username: string, password: string): Promise<void> {
    // setup the tokens
    const token = await getTokenForTest(username, password);

    // write a empty item
    const item = Item.fromNothing();
    item.id = testItem;

    const uploadedItem = await upload(item, {
        summary: 'live test of IWF step 1 (https://github.com/wvanderp/iwf)',
        authToken: token,

        server: testServer
    });

    // write the json to the body
    document.body.innerHTML = JSON.stringify(uploadedItem);
}

async function uploadTestPart2(username: string, password: string): Promise<void> {
    // setup the tokens
    const token = await getTokenForTest(username, password);

    // get the item
    const item = await requestItem(testItem);

    // fill the item with stuff
    item.labels.push(
        Label.fromString('en', 'iwf integration test item'),
        Label.fromString('nl', 'iwf integratie test item')
    );

    item.descriptions.push(
        Description.fromString('en', 'this item was created by the iwf integration test'),
        Description.fromString('nl', 'dit item is gemaakt door de iwf integratie test')
    );

    item.aliases.push(
        Alias.fromString('en', 'iwf integration test item alias'),
        Alias.fromString('nl', 'iwf integratie test item alias')
    );

    // change the properties because test.wikidata.org is a test server and has different properties
    exampleCommonsMediaSnak.property = 'P50';
    exampleExternalIdSnak.property = 'P105';
    exampleGeoShapeSnak.property = 'P25413';
    exampleGlobeCoordinateSnak.property = 'P10';
    exampleMathSnak.property = 'P716';
    exampleMonolingualTextSnak.property = 'P246';
    exampleMusicalNotationSnak.property = 'P88936';
    exampleQuantitySnak.property = 'P63';
    exampleStringSnak.property = 'P11';
    exampleTabularDataSnak.property = 'P30175';
    exampleTimeSnak.property = 'P18';
    exampleUrlSnak.property = 'P21';
    exampleWikibaseItemSnak.property = 'P580';
    exampleWikibasePropertySnak.property = 'P353';

    item.statements.push(
        Statement.fromSnak(exampleCommonsMediaSnak),
        Statement.fromSnak(exampleExternalIdSnak),
        Statement.fromSnak(exampleGeoShapeSnak),
        Statement.fromSnak(exampleGlobeCoordinateSnak),
        Statement.fromSnak(exampleMathSnak),
        Statement.fromSnak(exampleMonolingualTextSnak),
        Statement.fromSnak(exampleMusicalNotationSnak),
        Statement.fromSnak(exampleQuantitySnak),
        Statement.fromSnak(exampleStringSnak),
        Statement.fromSnak(exampleTabularDataSnak),
        Statement.fromSnak(exampleTimeSnak),
        Statement.fromSnak(exampleUrlSnak),
        Statement.fromSnak(exampleWikibaseItemSnak),
        Statement.fromSnak(exampleWikibasePropertySnak)
    );

    const uploadedItem2 = await upload(item, {
        summary: 'live test of IWF step 2 (https://github.com/wvanderp/iwf)',
        authToken: token,

        server: testServer
    });

    // write the json to the body
    document.body.innerHTML = JSON.stringify(uploadedItem2);
}

async function uploadTestPart3(username: string, password: string): Promise<void> {
    // setup the tokens
    const token = await getTokenForTest(username, password);

    // get the item
    let item = await requestItem(testItem);

    // leave the item cleanish
    item = Item.fromNothing();
    item.id = testItem;
    item.labels.push(
        Label.fromString('en', 'iwf integration test item')
    );

    item.descriptions.push(
        Description.fromString('en', 'this item was created by the iwf integration test')
    );

    const uploadedItem3 = await upload(item, {
        summary: 'live test of IWF step 3 (https://github.com/wvanderp/iwf)',
        authToken: token,

        server: testServer
    });

    // write the json to the body
    document.body.innerHTML = JSON.stringify(uploadedItem3);
}

window.uploadTestPart1 = uploadTestPart1;
window.uploadTestPart2 = uploadTestPart2;
window.uploadTestPart3 = uploadTestPart3;
