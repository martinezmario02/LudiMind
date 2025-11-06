import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/ui/Header";
import CharacterSpeech from "../CharacterSpeech";

export default function IntroDetective() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow" onClick={() => navigate(`/emotions/${id}/situation`)}>
                <CharacterSpeech text={`Tengo un amigo que está en la situación del siguiente chat.`} image="/imgs/avatar_monkey.png" />
            </div>
        </div>
    );
}