/* eslint-disable no-console */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as dotenv from 'dotenv';

import {
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
    exampleWikibaseItemSnak
} from '../tests/testUtils/examples/snaks';

dotenv.config();
declare let process : {
    env: {
        WIKIDATA_USERNAME: string;
        WIKIDATA_PASSWORD: string;
    }
};

describe('uploading to wikidata', () => {
    it('should upload a item when requested', async function () {
        this.timeout(10000);

        // setup the tokens
        console.log('getting token');
        const token = await getToken(
            process.env.WIKIDATA_USERNAME,
            process.env.WIKIDATA_PASSWORD
        );
        
        // write a empty item
        console.log('cleaning item');
        let item = Item.fromNothing();
        item.id = 'Q118210327';

        const uploadedItem = await upload(item, {
            summary: 'live test of IWF step 1 (https://github.com/wvanderp/iwf)',
            authToken: token
        });

        expect(uploadedItem).to.be.an('object');
        expect(uploadedItem.statements).to.be.lengthOf(0);
        expect(uploadedItem.labels).to.be.lengthOf(0);
        expect(uploadedItem.descriptions).to.be.lengthOf(0);

        // fill the item with stuff
        console.log('filling item');
        item.labels.push(
            Label.fromString('en', 'iwf integration test item')
        );

        item.descriptions.push(
            Description.fromString('en', 'this item was created by the iwf integration test')
        );

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
            // Statement.fromSnak(exampleWikibasePropertySnak) // lets not anger the wikidata gods
        );

        const uploadedItem2 = await upload(item, {
            summary: 'live test of IWF step 2 (https://github.com/wvanderp/iwf)',
            authToken: token
        });

        expect(uploadedItem2).to.be.an('object');
        expect(uploadedItem2.statements).to.be.lengthOf(13);
        expect(uploadedItem2.labels).to.be.lengthOf(1);
        expect(uploadedItem2.descriptions).to.be.lengthOf(1);

        // leave the item cleanish
        console.log('cleaning item again');
        item = Item.fromNothing();
        item.id = 'Q118210327';
        item.labels.push(
            Label.fromString('en', 'iwf integration test item')
        );

        item.descriptions.push(
            Description.fromString('en', 'this item was created by the iwf integration test')
        );

        await upload(item, {
            summary: 'live test of IWF step 3 (https://github.com/wvanderp/iwf)',
            authToken: token
        });
    });
});
