import * as React from 'react';

import { Button, Dimmer, Form, Header, Icon, Loader, Message, Modal, Segment, Table } from 'semantic-ui-react';

import { api } from '../API';

import { ModelInformation, PersephoneApiApiEndpointsModelTrainRequest } from '../gen/api';

export interface ITrainState {
    models: ModelInformation[];
    isLoading: boolean;
    formErrorMessage: string;
    formFailed: boolean;
    formLoading: boolean;
    modalOpen: boolean;
    selectedModel: number;
}

export default class Train extends React.Component<{}, ITrainState> {
    constructor(props: any) {
        super(props);
        this.state = {
            formErrorMessage: "No error.",
            formFailed: false,
            formLoading: false,
            isLoading: true,
            modalOpen: false,
            models: [],
            selectedModel: -1,
        };
        this.getData = this.getData.bind(this);
        this.clickProcessModel = this.clickProcessModel.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    public getData() {
        this.setState({isLoading: true});
        api.modelGet().then(models => {
            console.log(models)
            this.setState({
                isLoading: false,
                models,
            })
        });
    }

    public componentDidMount() {
        this.getData();
    }

    public closeModal() {
        this.setState({
            modalOpen: false,
            selectedModel: -1,
        })
    }

    clickProcessModel = (modelId: number) => (event: any) => {
        this.setState({
            formErrorMessage: "No error.",
            formFailed: false,
            formLoading: false,
            modalOpen: true,
            selectedModel: modelId,
        } as Pick<ITrainState, any>)
    };

    public submitForm() {
        this.setState({formLoading: true})
        const requestData: PersephoneApiApiEndpointsModelTrainRequest = {
            modelID: this.state.selectedModel
        }
        api.persephoneApiApiEndpointsModelTrain(requestData).then(res => {
            this.setState({modalOpen: false, selectedModel: -1});
            this.getData()
        }).catch(res => res.text()).then(err => {
            console.error(err);
            this.setState({formLoading: false, formFailed: true, formErrorMessage: "The error message is: " + err});
        });
    }

    public render() {
        return (
            <div>
                <Header as='h1'>Train a model</Header>
                <Segment>
                    <Dimmer active={this.state.isLoading}>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    <Table basic='very'>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Corpus ID</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {this.state.models.map((model) => (
                            <Table.Row key={model.id}>
                                <Table.Cell>{model.id}</Table.Cell>
                                <Table.Cell>{model.name}</Table.Cell>
                                <Table.Cell>{model.corpusID}</Table.Cell>
                                <Table.Cell>
                                    <Button primary={true} onClick={this.clickProcessModel(model.id!)}>
                                        <Icon name='hourglass start' />
                                        Train this model
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                        </Table.Body>
                    </Table>
                </Segment>
                <Modal
                    open={this.state.modalOpen}
                    onClose={this.closeModal}>
                    <Modal.Header>Confirm train</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form loading={this.state.formLoading} error={this.state.formFailed}>
                                <Header>Are you sure you want to train this model?</Header>
                                {this.state.models && this.state.selectedModel !== -1 &&
                                    <Form.Field>
                                        <Form.Input label="ID" type="text" name="id" value={this.state.models!.find(model => model!.id === this.state!.selectedModel)!.id} readOnly={true} />
                                        <Form.Input label="Name" type="text" name="name" value={this.state.models!.find(model => model!.id === this.state!.selectedModel)!.name} readOnly={true} />
                                    </Form.Field>
                                }
                                <Message id="errormessage" error={true} header='Model training failed' content={this.state.formErrorMessage} />
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary={true} onClick={this.submitForm}>
                            <Icon name='check' />
                            Confirm
                        </Button>
                        <Button negative={true} onClick={this.closeModal}>
                            <Icon name='remove' />
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}