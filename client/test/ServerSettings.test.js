import './enzyme.config.js'
import React from 'react'
import {mount, shallow} from 'enzyme'

import App from "../src/components/App"
import Footer from '../src/components/Margins/Footer'
import ServerSettings from '../src/components/Margins/ServerSettings'

const startProperties = {
    serverSettings: {'serverPort': 'black-bottle.cs.colostate.edu:31400', 'serverConfig': {}},
    isOpen: true,
    toggleOpen: jest.fn(),
    updateServerConfig: jest.fn(),
};

function testRender() {

    const footer = mount(
        <Footer
            serverSettings={startProperties.serverSettings}
            updateServerConfig={startProperties.updateServerConfig}
        />);

    expect(footer.find('ServerSettings').length).toEqual(1);
}

test("Settings component should be rendered inside Footer", testRender);


function testRenderInput() {

    const settings = mount(
        <ServerSettings
            isOpen={startProperties.isOpen}
            serverSettings={startProperties.serverSettings}
            toggleOpen={startProperties.toggleOpen}
            updateServerConfig={startProperties.updateServerConfig}
        />);

    expect(settings.find('Input').length).toEqual(1);
}

test('An Input field should be rendered inside the Settings', testRenderInput);

function testUpdateInputText() {

    const settings = shallow(
        <ServerSettings
            isOpen={startProperties.isOpen}
            serverSettings={startProperties.serverSettings}
            toggleOpen={startProperties.toggleOpen}
            updateServerConfig={startProperties.updateServerConfig}
        />);

    expect(settings.state().inputText).toEqual(startProperties.serverSettings.serverPort);

    let inputText = 'Fake Input Text';
    simulateOnChangeEvent(inputText, settings);
    expect(settings.state().inputText).toEqual(inputText);
}

function simulateOnChangeEvent(inputText, reactWrapper) {
    let event = {target: {value: inputText}};
    reactWrapper.find('Input').at(0).simulate('change', event);
    reactWrapper.update();
}

test("onChangeEvent should update the component's state", testUpdateInputText);

function testUpdateServerPort() {
    mockConfigResponse();

    const app = mount(<App />);
    const settings = shallow(
        <ServerSettings
            isOpen={startProperties.isOpen}
            serverSettings={startProperties.serverSettings}
            toggleOpen={startProperties.toggleOpen}
            updateServerConfig={(value, config) => app.instance().updateServerConfig(value, config)}
        />);

    let actualBeforeServerPort = app.state().serverSettings.serverPort;
    let expectedBeforeServerPort = `http://${location.hostname}:`;

    let inputText = 'https://black-bottle.cs.colostate.edu:31400';
    simulateOnChangeEvent(inputText, settings);
    settings.find('Button').at(1).simulate('click');

    let actualAfterServerPort = app.state().serverSettings.serverPort;

    expect(actualBeforeServerPort).toEqual(expectedBeforeServerPort);
    expect(actualAfterServerPort).toEqual(inputText);
}

function mockConfigResponse() {
    fetch.mockResponse(JSON.stringify(
        {
            'placeAttributes': ["latitude", "longitude", "name"],
            'requestType': "config",
            'requestVersion': 1,
            'serverName': "t00"
        }));
}

test('onClick event for Save Button should update server port in App component', testUpdateServerPort);

