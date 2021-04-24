import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/webContent.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
// Editor
import EditorComponent from "./Editor";
import { EditorState, ContentState, convertFromHTML, convertToRaw } from "draft-js";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// Component
import Header from "../Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { putWebContent, getWebContent } from "../redux/webContent/action";
import LoadingComponent from "../general/Loading";
import moment from "moment";

export default function WebContent() {
    const dispatch = useDispatch();
    const [applicationType, setApplicationType] = useState<string>("normal");

    // Tab
    const [activeTab, setActiveTab] = useState("1");
    const toggle = (tab: string) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    // Get Web content for a specific type of application from store(normal / interim)
    const webContent = useSelector((state: RootState) => (state.webContent.data as any)[applicationType]);
    const { normal, interim } = useSelector((state: RootState) => state.webContent.data);

    //The type of web content currently selected
    //(application_procedure / application_note / confirmation_letter)
    const [currentWebContent, setCurrentWebContent] = useState("application_procedure");

    //When tab is clicked
    const handleCurrentWebContent = (text: string) => {
        if (text === "系統資料") {
            return;
        }
        if (text === "申請需知") {
            setCurrentWebContent("application_procedure");
        } else if (text === "申請提示") {
            setCurrentWebContent("application_note");
        } else if (text === "確認信") {
            setCurrentWebContent("confirmation_letter");
        }
    };

    //Handle changing between normal and interim
    const handleTypeChange = (e: any) => {
        setApplicationType(e.target.value);
    };

    // Editor
    const [editorState, setEditorState] = useState<any>();

    //Preview content?
    const [convertedContent, setConvertedContent] = useState();

    useEffect(() => {
        //Set the editor to be empty?
        setEditorState(() => EditorState.createEmpty());

        //Get the web content from DB
        dispatch(getWebContent());
    }, [dispatch]);

    //When user select different web content
    useEffect(() => {
        //Check if the object is empty
        if (Object.keys(normal).length === 0 || Object.keys(interim).length === 0) return;

        const blocksFromHTML = convertFromHTML((webContent as any)[currentWebContent]);
        const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
        setEditorState((temp: any) => (temp = EditorState.createWithContent(state)));
    }, [currentWebContent, webContent]);

    //Handle user input?
    const handleEditorChange = (state: any) => {
        setEditorState(state);
    };

    //When user input or change web content?
    useEffect(() => {
        if (editorState != null) {
            const currentContentAsHTML = convertToRaw((editorState as any).getCurrentContent());

            setConvertedContent(currentContentAsHTML as any);
        }
    }, [editorState]);

    const createMarkup = (html: any) => {
        return {
            __html: draftToHtml(html),
        };
    };

    //Check if the object is empty, if so, show loading component
    if (Object.keys(normal).length === 0 || Object.keys(interim).length === 0) {
        return <LoadingComponent />;
    }

    return (
        <div className="outer_container">
            <Header title="網頁內容設定" />
            <main>
                <section className={styles.top_container}>
                    <div>
                        <h6>
                            <span className={styles.editIcon}>
                                <FontAwesomeIcon icon={faPen} />
                            </span>
                            網頁內容
                        </h6>
                        <select name="type" defaultValue={applicationType} onChange={(e) => handleTypeChange(e)}>
                            <option value="normal">新生</option>
                            <option value="interim">插班生</option>
                        </select>
                    </div>
                    <div>
                        <Nav tabs>
                            {["申請需知", "申請提示", "確認信", "系統資料"].map((item, index) => (
                                <NavItem>
                                    <NavLink
                                        key={"tab" + index}
                                        className={`${activeTab === `${index + 1}` ? "active" : ""} ${
                                            styles.hoverPointer
                                        }`}
                                        onClick={() => {
                                            toggle(`${index + 1}`);
                                            handleCurrentWebContent(item);
                                        }}
                                    >
                                        {item}
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>

                        <TabContent activeTab={activeTab}>
                            {activeTab === "1" && <TabPane tabId="1"></TabPane>}
                            <TabPane tabId="2"></TabPane>
                            <TabPane tabId="3"></TabPane>
                            {activeTab !== "4" && (
                                <div>
                                    <div className={`${styles.container} ${styles.preview}`}>
                                        <h5>預覽</h5>
                                        <div dangerouslySetInnerHTML={createMarkup(convertedContent)}></div>
                                    </div>

                                    <EditorComponent
                                        editorState={editorState}
                                        handleEditorChange={handleEditorChange}
                                    />

                                    <div className={styles.controlBtns}>
                                        <button
                                            className={styles.submit}
                                            type="submit"
                                            onClick={() => {
                                                dispatch(
                                                    putWebContent(
                                                        applicationType,
                                                        createMarkup(convertedContent).__html,
                                                        currentWebContent
                                                    )
                                                );
                                            }}
                                        >
                                            修改
                                        </button>
                                    </div>
                                </div>
                            )}
                            <TabPane tabId="4">
                                <div className={`${styles.systemInfoContainer}`}>
                                    <p>
                                        <strong>
                                            最後修改時間:
                                            {moment(webContent.updated_at).format("YYYY/MM/DD hh:mm:ss")}
                                        </strong>
                                    </p>
                                </div>
                            </TabPane>
                        </TabContent>
                    </div>
                </section>
            </main>
        </div>
    );
}
