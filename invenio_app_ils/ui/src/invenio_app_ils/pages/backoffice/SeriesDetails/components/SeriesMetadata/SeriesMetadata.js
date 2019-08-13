import React, { Component } from 'react';
import { Grid, Segment, Container, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { MetadataTable } from '../../../components/MetadataTable';
import { EditButton } from '../../../components/buttons';
import {
  document as documentApi,
  series as seriesApi,
} from '../../../../../common/api';
import { openRecordEditor } from '../../../../../routes/urls';
import { DeleteRecordModal } from '../../../components/DeleteRecordModal';

export default class SeriesMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteSeries = props.deleteSeries;
    this.seriesPid = this.props.seriesDetails.metadata.pid;
  }

  createRefProps(seriesPid) {
    return [
      {
        refType: 'Document',
        onRefClick: documentPid =>
          openRecordEditor(documentApi.url, documentPid),
        getRefData: () =>
          documentApi.list(
            documentApi
              .query()
              .withSeriesPid(seriesPid)
              .qs()
          ),
      },
    ];
  }

  renderHeader(series) {
    return (
      <Grid.Row>
        <Grid.Column width={13} verticalAlign={'middle'}>
          <Header as="h1">
            Series #{series.pid} - {series.metadata.title.title}
          </Header>
        </Grid.Column>
        <Grid.Column width={3} textAlign={'right'}>
          <EditButton
            clickHandler={() => openRecordEditor(seriesApi.url, series.pid)}
          />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Series record
            with ID ${series.pid}?`}
            refProps={this.createRefProps(series.pid)}
            onDelete={() => this.deleteSeries(series.pid)}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }

  prepareData(series) {
    const rows = [
      { name: 'Title', value: series.metadata.title.title },
      { name: 'Mode of Issuance', value: series.metadata.mode_of_issuance },
      { name: 'Authors', value: series.metadata.authors },
    ];
    return rows;
  }

  render() {
    const series = this.props.seriesDetails;
    const rows = this.prepareData(series);
    return (
      <Segment className="series-metadata">
        <Grid padded columns={2}>
          {this.renderHeader(series)}
          <Grid.Row>
            <Grid.Column>
              <MetadataTable rows={rows} />
            </Grid.Column>
            <Grid.Column>
              <Container>
                <Header as="h3">Abstracts</Header>
                <p>{series.metadata.abstracts}</p>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

SeriesMetadata.propTypes = {
  seriesDetails: PropTypes.object.isRequired,
};