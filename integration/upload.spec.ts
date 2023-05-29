/* eslint-disable no-console */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as dotenv from 'dotenv';

import {
    Alias,
    Description, Item, Label, Statement, getToken, upload
} from '../src';
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
} from '../tests/testUtils/examples/snaks';

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
    it.only('should upload a item when requested', async function () {
        this.timeout(10000);

        // setup the tokens
        console.log('getting token');
        const token = await getToken(
            process.env.WIKIDATA_USERNAME,
            process.env.WIKIDATA_PASSWORD,
            testServer
        );

        // write a empty item
        console.log('cleaning item');
        let item = Item.fromNothing();
        item.id = testItem;

        const uploadedItem = await upload(item, {
            summary: 'live test of IWF step 1 (https://github.com/wvanderp/iwf)',
            authToken: token,

            server: testServer
        });

        expect(uploadedItem).to.be.an('object');
        expect(uploadedItem.statements).to.be.lengthOf(0);
        expect(uploadedItem.labels).to.be.lengthOf(0);
        expect(uploadedItem.descriptions).to.be.lengthOf(0);

        // fill the item with stuff
        console.log('filling item');
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

        expect(uploadedItem2).to.be.an('object');
        expect(uploadedItem2.statements).to.be.lengthOf(14);
        expect(uploadedItem2.labels).to.be.lengthOf(2);
        expect(uploadedItem2.descriptions).to.be.lengthOf(2);
        expect(uploadedItem2.aliases).to.be.lengthOf(2);

        // leave the item cleanish
        console.log('cleaning item again');
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

        expect(uploadedItem3).to.be.an('object');
        expect(uploadedItem3.statements).to.be.lengthOf(0);
        expect(uploadedItem3.labels).to.be.lengthOf(1);
        expect(uploadedItem3.descriptions).to.be.lengthOf(1);
        expect(uploadedItem3.aliases).to.be.lengthOf(0);
    });
});
