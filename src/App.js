import './App.css';
import * as React from 'react';
import {
    withLicensesProvider,
    withConfig,
    withActiveLicenses,
    withActiveCurriculums,
    withActiveProducts,
    withLicenseClient,
} from "@greatminds/dp-license-react-sdk";

import { Version } from '@greatminds/dp-license-sdk';

function DisplayConfig({config}) {
    return (
        <b>{config?.hostURL}</b>
    );
}

function DisplayLicenses({licenses}) {
    return (<b>{JSON.stringify(licenses)}</b>)
}

function DisplayCurriculums({curriculums}) {
    return (<b>{JSON.stringify(curriculums)}</b>)
}

function DisplayProducts({products}) {
    return (<b>{JSON.stringify(products)}</b>)
}

class ClientUsage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasAccess: false,
        };
    }

    async componentDidMount() {
        const hasAccess = await this.props.client?.hasALicenseToProduct(['Affirm']);
        this.setState({ hasAccess });
    }

    render() {
        return (
            <div>
                <b>Access to Affirm: </b> <span>{this.state.hasAccess ? 'Yes' : 'No'}</span>
            </div>
        );
    }
}

const LicenseDisplayConfig = withConfig(DisplayConfig);
const WrappedDisplayLicenses = withActiveLicenses(DisplayLicenses)
const WrappedDisplayCurriculums = withActiveCurriculums(DisplayCurriculums)
const WrappedDisplayProducts = withActiveProducts(DisplayProducts)
const WithLicenseClient = withLicenseClient(ClientUsage);

function App() {
    return (
    <div className="App">
      <header className="App-header">
        <LicenseDisplayConfig/>
        <b>----------------------------------------------------------</b>
        <WrappedDisplayLicenses/>
        <b>----------------------------------------------------------</b>
        <WrappedDisplayCurriculums/>
        <b>----------------------------------------------------------</b>
        <WrappedDisplayProducts/>
        <b>----------------------------------------------------------</b>
        <WithLicenseClient/>
      </header>
    </div>
  );
}

window.onunhandledrejection = function(e) {
    console.log('Error detected!');
    console.log(e.reason);
}

export default withLicensesProvider({
    hostURL: 'https://digital.dev.greatminds.dev',
    districtId: '7300e0f6-a132-42d7-abbb-4c1371a1eec9',
    version: Version.V3,
})(App);
