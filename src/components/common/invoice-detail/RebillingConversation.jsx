import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { Send2, Status } from "iconsax-react";
import { fetcher } from "utils/axios";
import { openSnackbar } from "api/snackbar";
import CircularLoader from "../loader/CircularLoader";
import axios from "axios";
import { decryptToken } from "utils/tokenUtils";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

const RebillingConversation = ({ trip_id }) => {
    const theme = useTheme();
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);

    const chatEndRef = useRef(null);
    const [comment, setComment] = useState("");
    const [cost, setCost] = useState("");
    const [isChatClosed, setIsChatClosed] = useState(false);

    const isDark = theme.palette.mode === "dark";
    const hasPatientComment = conversation?.find((item) => item.from === 'patient');
    const approvedStatus = conversation?.find((item) => item.status === 'approved');

    const handleGetRebillingsChats = async () => {
        try {
            const response = await fetcher(`get-rebilling-reimbursement-trip?id=${trip_id}`);
            if (response.status === true) {
                setConversation(response?.data)
            }
            else {
                openSnackbar({
                    open: true,
                    message: response.message || 'Failed to fetch data',
                    variant: 'alert',
                    alert: { color: 'error' }
                });
            }
        }
        catch (error) {
            openSnackbar({
                open: true,
                message: error.message || 'Failed to fetch data',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
    };

    const handleBrokerComment = async () => {
        if (!cost) return;
        const payload = {
            id: trip_id,
            rebilling: { comment: comment || "Counter proposal", cost },
            call: hasPatientComment ? "no" : "yes"
        };

        try {
            const { status } = await axios.post(`${API_URL}rebilling-reimbursement-trip`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
            });

            if (status === 200) {
                setConversation([
                    ...conversation,
                    {
                        from: "broker",
                        comment: comment || "Counter proposal",
                        cost,
                        status: conversation.length > 0 && hasPatientComment ? "pending" : "approved",
                        datetime: new Date().toISOString()
                    }
                ]);

                setComment("");
                setCost("");
                hasPatientComment ?? setIsChatClosed(true);
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || "Server error",
                variant: "alert",
                alert: { color: "error" }
            });
        }
    };

    const handlePatientApproval = async (id) => {
        const updated = conversation.map(msg =>
            msg.message_id === id ? { ...msg, status: "approved" } : msg
        );
        setConversation([
            ...updated,
        ]);
        try {
            const response = await axios.post(`${API_URL}rebilling-reimbursement-trip/change-status`, { id: trip_id, message_id: id, status: 'approved' }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${decryptedToken}`,
                },
            });
            if (response.status === 200) {
                setLoading(false)
            }

        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || 'server issue',
                variant: 'alert',
                alert: { color: 'error' }
            });
        }
        setIsChatClosed(true);
    };


    useEffect(() => {
        const chatContainer = chatEndRef.current?.parentElement;

        if (!chatContainer) return;

        const handleScroll = () => {
            const nearBottom =
                chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 50;
            setIsNearBottom(nearBottom);
        };

        chatContainer.addEventListener("scroll", handleScroll);

        return () => {
            chatContainer.removeEventListener("scroll", handleScroll);
        };
    }, []);


    useEffect(() => {
        if (isNearBottom) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversation, isNearBottom]);


    useEffect(() => {
        handleGetRebillingsChats();

        const interval = setInterval(() => {
            handleGetRebillingsChats();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Paper
            sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                maxWidth: 500,
                bgcolor: isDark ? "#1D2630" : "#f9f9f9",
                color: isDark ? "#f5f5f5" : "#212121",
                border: isDark ? "1px solid #333" : "none",
                boxShadow: isDark ? "0 0 8px rgba(255,255,255,0.05)" : "none",
                transition: "all 0.3s ease"
            }}
        >
            {/* Conversation Thread */}
            <Box
                sx={{
                    position: "relative",
                    flexGrow: 1,
                    mb: 2,
                    height: isChatClosed
                        ? 'calc(100vh - 245px)'
                        : 'calc(100vh - 335px)',
                    overflowY: "auto",
                    pr: 1,
                    "&::-webkit-scrollbar": { display: "none" },
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none"
                }}
            >
                {loading ?
                    <CircularLoader text="Loading chat..." height="100%" />
                    :
                    <>
                        <Box sx={{
                            height: "100%", overflowY: "auto", "&::-webkit-scrollbar": { display: "none" },
                            "-ms-overflow-style": "none",
                            "scrollbar-width": "none"
                        }}>
                            {conversation?.map((msg, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: msg.from === "broker" ? "flex-end" : "flex-start",
                                        mb: 2,
                                        px: 1
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: msg.from === "broker" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                            bgcolor: msg.from === "patient" ? (isDark ? "#1D2630" : "white") : (isDark ? "#2e7d32cc" : "#e3f1e2ff"),
                                            boxShadow: isDark ? "0px 2px 6px rgba(255,255,255,0.1)" : "0px 2px 6px rgba(0,0,0,0.15)",
                                            maxWidth: "70%",
                                            color: isDark ? "#f5f5f5" : "#212121"
                                        }}
                                    >
                                        {/* Sender Name */}
                                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5, color: msg.from === "patient" ? (isDark ? "#4dd0e1" : "#00796b") : (isDark ? "#81c784" : "#2e7d32") }}>
                                            {msg.from === "patient" ? "Patient" : "Broker"}
                                        </Typography>

                                        {/* Comment */}
                                        <Typography variant="body1">{msg.comment}</Typography>

                                        {/* Proposed cost */}
                                        {msg.cost && (
                                            <Typography variant="caption" sx={{ display: "block", mt: 0.5, fontWeight: "bold", color: isDark ? "#ddd" : "#424242" }}>
                                                💰 Proposed cost: ${msg.cost}
                                            </Typography>
                                        )}

                                        {/* Status */}
                                        {msg.status === "approved" && (
                                            <Typography variant="caption" sx={{ display: "block", mt: 0.5, fontWeight: "bold", color: isDark ? "#81c784" : "green" }}>
                                                ✅ Approved
                                            </Typography>
                                        )}

                                        {/* Approve button for broker */}
                                        {msg.from === "patient" && msg.status === "pending" && !isChatClosed && (
                                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                                <Button
                                                    variant="outlined"
                                                    color="success"
                                                    size="small"
                                                    sx={{ mt: 1, p: "0", fontSize: "12px", borderColor: isDark ? "#81c784" : undefined, color: isDark ? "#81c784" : undefined }}
                                                    onClick={() => handlePatientApproval(msg.message_id)}
                                                >
                                                    Approve
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            ))}

                            {/* Scroll anchor */}
                            <div ref={chatEndRef} />
                            {!isNearBottom && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    sx={{
                                        position: "absolute",
                                        bottom: "0px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        zIndex: 10,
                                        borderRadius: "20px",
                                        height: "35px",
                                        color: "white",
                                        opacity: "80%"
                                    }}
                                >
                                    <MdKeyboardDoubleArrowDown />
                                </Button>
                            )}

                        </Box>
                        {conversation.length < 1 &&
                            <Box>Patient have no comments</Box>
                        }
                    </>
                }
            </Box>

            {/* Input Section */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    p: 1.5,
                    borderTop: `1px solid ${isDark ? "#1D2630" : "#e0e0e0"}`,
                    bgcolor: isDark ? "#1D2630" : "#ffffff",
                    borderRadius: "12px",
                    boxShadow: isDark
                        ? "0 -2px 8px rgba(255,255,255,0.05)"
                        : "0 -2px 8px rgba(0,0,0,0.05)"
                }}
            >
                <Typography
                    variant="subtitle2"
                    color={isDark ? "#bbb" : "text.secondary"}
                    sx={{ mb: 0.5 }}
                >
                    💬 Broker Response
                </Typography>

                {isChatClosed || approvedStatus ? (
                    <Typography
                        variant="body2"
                        color="error"
                        align="center"
                        sx={{
                            mt: 1,
                            fontWeight: 500,
                            bgcolor: isDark ? "#2b1818" : "#fff3f3",
                            borderRadius: "8px",
                            p: 0.8,
                            border: `1px solid ${isDark ? "#b71c1c" : "#ffcdd2"}`
                        }}
                    >
                        🔒 Chat closed — no further messages allowed.
                    </Typography>
                ) : (
                    <>
                        <TextField
                            label="Write your comment..."
                            placeholder="Enter your message here"
                            fullWidth
                            multiline
                            minRows={2}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isChatClosed}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    color: isDark ? "#f5f5f5" : "inherit",
                                    "& fieldset": {
                                        borderColor: isDark ? "#555" : undefined
                                    }
                                }
                            }}
                        />
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Box>
                                <TextField
                                    label="Propose cost ($)"
                                    type="number"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    disabled={isChatClosed}
                                    sx={{
                                        flex: 1,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "12px",
                                            color: isDark ? "#f5f5f5" : "inherit",
                                            "& fieldset": {
                                                borderColor: isDark ? "#555" : undefined
                                            }
                                        }
                                    }}
                                />
                                {!cost && <Typography sx={{ fontSize: '12px', color: 'red', marginTop: "2px" }}>Rebilling cost is required</Typography>}
                            </Box>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleBrokerComment}
                                disabled={isChatClosed}
                                sx={{
                                    px: 3,
                                    borderRadius: "12px",
                                    fontWeight: "bold",
                                    gap: "6px",
                                    flex: "1",
                                    maxHeight: "46px",
                                    bgcolor: isDark ? "success" : undefined,
                                    "&:hover": {
                                        bgcolor: isDark ? "success" : undefined
                                    }
                                }}
                            >
                                <span>Send</span> <Send2 size="16" color="#fff" />
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Paper>
    );
};

export default RebillingConversation;
