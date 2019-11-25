import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormGroup, Label, Input, Form, Button, CustomInput } from "reactstrap";
import React from "react";
import ImporterProps from "./ImporterProps";

export function InsertPlaylistComponent(props: ImporterProps) {
    const [playlistSelection, setPlaylistSelection] = useState<string | undefined>(undefined);
    const [clearPlaylist, setClearPlaylist] = useState(false);
    const [duplicates, setDuplocates] = useState(false);

    const { t } = useTranslation();

    return <Form>
        <FormGroup className="mb-3">
            <Label>{t("selectPlaylist")}</Label>
            <select className="form-control" onChange={e => setPlaylistSelection(e.target.value)}>
                {
                    props.playlists!.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                }
            </select>
        </FormGroup>
        <FormGroup check>
            <Label check>
                <CustomInput
                    type="checkbox"
                    id="clearCheckbox"
                    onChange={e => setClearPlaylist(e.target.checked)}
                    label={t("clearPlaylist")}
                />
            </Label>
        </FormGroup>
        <FormGroup check className="mb-3">
            <Label check>
                <CustomInput
                    type="checkbox"
                    id="duplicatesCheckbox"
                    onChange={e => setDuplocates(e.target.checked)}
                    label={t("allowDuplicates")}
                />
            </Label>
        </FormGroup>
        <Button
            onClick={() => props.spotifyUtils.importPlaylist(playlistSelection!, clearPlaylist, duplicates)}
            color="success">
            {t("startImport")}
        </Button>
    </Form>
}