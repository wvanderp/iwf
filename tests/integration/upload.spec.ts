/* eslint-disable no-console */

import * as dotenv from 'dotenv';

import {
    Alias,
    Description, Item, Label, Statement, getToken, upload
} from '../../src';
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
} from '../unit/testUtils/examples/snaks';

dotenv.config();
declare let process : {
    env: {
        WIKIDATA_USERNAME: string;
        WIKIDATA_PASSWORD: string;
    }
};

const testServer = 'https://test.wikidata.org';
const testItem = 'Q231400';

describe('uploading to wikidata', () => {
    it(
        'should upload a item when requested',
        async function () {
        // setup the tokens
            const token = await getToken(
                process.env.WIKIDATA_USERNAME,
                process.env.WIKIDATA_PASSWORD,
                {
                    server: testServer
                }
            );

            // write a empty item
            let item = Item.fromNothing();
            item.id = testItem;

            const uploadedItem = await upload(item, {
                summary: 'live test of IWF step 1 (https://github.com/wvanderp/iwf)',
                authToken: token,

                server: testServer
            });

            expect(uploadedItem).toBeInstanceOf(Object);
            expect(uploadedItem.statements).toHaveLength(0);
            expect(uploadedItem.labels).toHaveLength(0);
            expect(uploadedItem.descriptions).toHaveLength(0);

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

            expect(uploadedItem2).toBeInstanceOf(Object);
            expect(uploadedItem2.statements).toHaveLength(14);
            expect(uploadedItem2.labels).toHaveLength(2);
            expect(uploadedItem2.descriptions).toHaveLength(2);
            expect(uploadedItem2.aliases).toHaveLength(2);

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

            expect(uploadedItem3).toBeInstanceOf(Object);
            expect(uploadedItem3.statements).toHaveLength(0);
            expect(uploadedItem3.labels).toHaveLength(1);
            expect(uploadedItem3.descriptions).toHaveLength(1);
            expect(uploadedItem3.aliases).toHaveLength(0);
        },
        100000
    );
});
