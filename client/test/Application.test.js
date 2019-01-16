import './enzyme.config.js'
import React from 'react'
import { shallow } from 'enzyme'
import Application from '../src/components/Application/Application'


function testInitialState() {
    const app = shallow(<Application/>);

    let actualConfig = app.state().serverConfig;
    let expectedConfig = null;
    expect(actualConfig).toEqual(expectedConfig);

    let actualOptions = app.state().planOptions;
    let expectedOptions = {
        units: { miles: 3959, kilometers: 6371 },
        activeUnit: 'miles'
    };

    expect(actualOptions).toEqual(expectedOptions);
}

test("Testing Application's initial state", testInitialState);

function testUpdateOption() {
    const app = shallow(<Application/>);

    app.instance().updatePlanOption("activeUnit", "kilometers");

    let actualUnit = app.state().planOptions.activeUnit;
    let expectedUnit = "kilometers";
    expect(actualUnit).toEqual(expectedUnit);
}

test("Testing Application's updatePlanOption function", testUpdateOption);
