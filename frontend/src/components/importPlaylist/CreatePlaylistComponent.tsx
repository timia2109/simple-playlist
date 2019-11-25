import { useState } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import React from "react";
import { useTranslation } from "react-i18next";
import ImporterProps from "./ImporterProps";

export function CreatePlaylistComponent(props: ImporterProps) {
    const [playlistName, setPlaylistName] = useState("");
    const { t } = useTranslation();

    return <Form>
        <FormGroup className="mb-3">
            <Label>{t("playlistTitle")}</Label>
            <Input
                value={playlistName}
                type="text"
                onChange={e => setPlaylistName(e.target.value)}
            />
        </FormGroup>
        <Button
            onClick={() => props.spotifyUtils.createPlaylist(playlistName)}
            color="success">
            {t("startImport")}
        </Button>
    </Form>
} 