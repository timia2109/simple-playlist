import React from 'react';
import { SpotifyAppToken } from '../../backend/src/getSpotifyAppToken';
import API from './API';
import moment from 'moment';
import { Container, Row, Col, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { LoadingComponent } from './components/LoadingComponent';
import { EntriesComponent } from './components/EntriesComponent';
import SeekComponent from './components/SeekComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Translation } from 'react-i18next';
import "./i18n/i18n";

interface AppStates {
    api: API;
    spotifyAppToken: SpotifyAppToken | undefined;
}

export default class App extends React.Component<{}, AppStates> {

    constructor(props: {}) {
        super(props);

        this.state = {
            api: new API(),
            spotifyAppToken: undefined
        };
    }

    componentDidMount() {
        this.loadSpotifyToken();
    }

    private async loadSpotifyToken() {
        let token = await this.state.api.getSpotifyAccessToken();

        this.setState({
            spotifyAppToken: token
        });

        let expires_on = moment(token.expires_on);

        let expiresDuration = moment.duration(expires_on.diff(moment())).asMilliseconds();

        // Get new Token when it expires
        window.setTimeout(this.loadSpotifyToken.bind(this), expiresDuration);
    }

    render() {
        return <Translation>
            {
                (t) => <>
                    <Navbar color="light" light>
                        <NavbarBrand>{t("title")}</NavbarBrand>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="https://github.com/timia2109/simple-playlist" target="_blank" rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={faGithub} />
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Navbar>
                    <Container className="mt-3">
                        {this.state.spotifyAppToken === undefined && <LoadingComponent title={t("loadingApp")} />}
                        {this.state.spotifyAppToken !== undefined && <Row>
                            <Col md="6">
                                <SeekComponent api={this.state.api} spotifyToken={this.state.spotifyAppToken} />
                            </Col>
                            <Col md="6">
                                <EntriesComponent api={this.state.api} spotifyToken={this.state.spotifyAppToken} />
                            </Col>
                        </Row>}
                    </Container>
                </>
            }
        </Translation>;
    }
}