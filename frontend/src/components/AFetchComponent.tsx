import { DefaultComponentProps } from "../DefaultComponentProps";
import React from "react";
import { LoadingComponent } from "./LoadingComponent";
import API from "../API";

export interface AFetchStates {
    dataLoaded: boolean;
}

export abstract class AFetchComponent<P extends DefaultComponentProps, S extends AFetchStates> extends React.Component<P, S>  {
    
    protected autoLoad: boolean = false;

    public componentDidMount() {
        this.refresh();

        if (this.autoLoad) {
            this.props.api.attach(this);
        }
    }

    public componentWillUnmount() {
        if (this.autoLoad) {
            this.props.api.detach(this);
        }
    }

    // Secound method to overload
    public reload() {
        this.refresh();
    }

    public async refresh() {
        await this.handleLoadData(this.props.api);
        this.setState({dataLoaded: true});
    }

    protected abstract handleLoadData(api: API): Promise<any>;
    protected abstract renderWithData(): JSX.Element;

    render() {
        if (this.state.dataLoaded) {
            return this.renderWithData();
        }
        else {
            return <LoadingComponent />
        }
    }
}