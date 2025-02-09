import React, { useState, useEffect } from "react";
import {
    Container,
    ListContainer,
    Header,
} from "../CreateTeamsPage/CreateTeamsPage-style";

import { Scenario, Quest } from "../../Models/Scenario";
import Input from "@material-ui/core/Input";
import ScenarioList from "../../Components/ScenarioList";
import QuestDetails from "../../Components/QuestDetails/QuestDetails";
import instance from "../../Api/axiosInstance";
import styles from "./CreateScenarios.module.css";

import Modal from "react-modal";
import styled from "styled-components";
import { useHistory } from "react-router";
import useSnackbar from "../../Hooks/useSnackbar";
import { CircularProgress } from "@material-ui/core";

interface CreateScenariosPageProps {}

const customModalStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        maxWidth: "90%",
        marginRight: "-20%",
        transform: "translate(-50%, -50%)",
        justifyContent: "center",
        flexDirection: "column" as "column",
        display: "flex",
    },
};

const QuestElement = ({ quest }: { quest: Quest }) => {
    return <QuestContainer>{quest.name}</QuestContainer>;
};
const QuestContainer = styled.div`
    background-color: rgba(200, 200, 200, 0.6);
    margin: 10px;
    padding: 5px;
    border: 2px solid black;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    :hover {
        transform: scale(1.03);
        font-weight: bold;
        cursor: pointer;
    }
`;

const CreateScenariosPage: React.FC<CreateScenariosPageProps> = () => {
    const history = useHistory();
    const initialScenario = {
        _id: "",
        name: "",
        description: "",
        image: "",
        quests: [],
    };
    const [newScenario, setNewScenario] = useState<Scenario>(initialScenario);
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [displayedScenario, setDisplayedScenario] = useState<
        Scenario | undefined
    >();

    const [Snackbar, setMessage, setSeverity] = useSnackbar();

    const [displayedQuest, setDisplayedQuest] = useState(-1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const allScenarios = await instance.get<Scenario[]>(
                    "scenarios"
                );
                setScenarios(allScenarios.data);
            } catch (error) {
                setMessage("Nie udało się pobrać scenariuszy");
                setSeverity("error");
            } finally {
                setLoading(false);
            }
        })();
    }, [setMessage, setSeverity]);

    const showScenario = (scenario: Scenario) => {
        setDisplayedScenario(scenario);
    };

    const hideScenario = () => {
        setDisplayedScenario(undefined);
        setDisplayedQuest(-1);
    };
    const createNewScenario = () => {
        history.push("/scenario/create");
    };
    if (loading) return <CircularProgress />;
    return (
        <>
            <Container className={styles.createScenarioContainer}>
                <Header>SCENARIUSZE</Header>
                {displayedScenario && (
                    <Modal
                        isOpen={!!displayedScenario}
                        onRequestClose={hideScenario}
                        style={customModalStyles}
                        contentLabel="Example Modal"
                    >
                        <h3>{displayedScenario?.name}</h3>
                        {displayedScenario.image.length > 100 && (
                            <img
                                alt={"obraz - " + displayedScenario.name}
                                src={displayedScenario.image}
                            />
                        )}
                        <h4>Questy:</h4>
                        {displayedScenario.quests.map((quest, idx) =>
                            displayedQuest !== idx ? (
                                <span onClick={() => setDisplayedQuest(idx)}>
                                    <QuestElement key={idx} quest={quest} />
                                </span>
                            ) : (
                                <span onClick={() => setDisplayedQuest(-1)}>
                                    <QuestDetails quest={quest} />
                                </span>
                            )
                        )}
                        <div style={{ marginTop: "20px" }}>
                            <button
                                className={styles.buttonCreateScenarios1}
                                onClick={hideScenario}
                            >
                                ZAMKNIJ
                            </button>
                        </div>
                    </Modal>
                )}
                <ListContainer className={styles.listContainerStyles}>
                    <ScenarioList
                        scenarios={scenarios}
                        showScenario={showScenario}
                    />
                </ListContainer>
                <div
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                    }}
                >
                    <Input
                        value={newScenario.name}
                        onChange={(e) =>
                            setNewScenario({
                                ...newScenario,
                                name: e.target.value,
                            })
                        }
                    />
                </div>
                <div
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                    }}
                >
                    <button
                        onClick={() => createNewScenario()}
                        className={styles.buttonCreateScenarios1}
                    >
                        UTWÓRZ NOWY SCENARIUSZ
                    </button>
                </div>
            </Container>
            {Snackbar}
        </>
    );
};

export default CreateScenariosPage;
