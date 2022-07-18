import './App.css';
import * as React from 'react';
import {
    withLicensesProvider,
    withConfig,
    withActiveLicenses,
    withActiveCurriculums,
    withActiveProducts,
    withLicenseClient,
    UnauthorizedError,
    NotFoundError,
    ServerError,
    Version
} from "@greatminds/dp-license-react-sdk";
import {ErrorBoundary} from 'react-error-boundary'

function ErrorFallback({error}) {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.code}</pre>
            <pre>{error.message}</pre>
            <pre>{error.details}</pre>
        </div>
    )
}

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

const myErrorHandler = (error) => {
    if(error instanceof UnauthorizedError) {
        console.info('Authorization info invalid or expired');
    } else if(error instanceof NotFoundError) {
        console.info('License not found');
    } else if(error instanceof ServerError) {
        console.info('License not found');
    } else {
        console.info('Unexpected error');
    }
}

function App() {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
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
        </ErrorBoundary>
    );
}

export default withLicensesProvider({
    hostURL: 'https://digital.dev.greatminds.dev',
    districtId: '7300e0f6-a132-42d7-abbb-4c1371a1eec9',
    version: Version.V3,
})(App);
