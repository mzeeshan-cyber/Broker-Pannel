import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { Send2 } from "iconsax-react";
import { openSnackbar } from "api/snackbar";
import axios from "axios";
import { decryptToken } from "utils/tokenUtils";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { BiCheckDouble } from "react-icons/bi";
import { fetcher, fetcherPost } from "utils/axios";

const Conversation = ({ comments, open }) => {
    const theme = useTheme();
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [conversation, setConversation] = useState(comments);
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const encryptedFromStorage = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedFromStorage);
    const chatEndRef = useRef(null);
    const [comment, setComment] = useState("");
    const isDark = theme.palette.mode === "dark";

    const handleBrokerComment = async () => {
        if (!comment.trim()) return;

        const payload = { message: comment };
        const newMessage = {
            user_role: "broker",
            comment: comment,
            is_read: 0,
            created_at: new Date().toISOString()
        };

        setConversation(prev => ({
            ...prev,
            comments: [...(prev.comments || []), newMessage]
        }));

        setComment("");

        try {
            await axios.post(
                `${API_URL}add-comment/${conversation.id}`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${decryptedToken}`
                    }
                }
            );
        } catch (error) {
            openSnackbar({
                open: true,
                message: error.message || "Server error",
                variant: "alert",
                alert: { color: "error" }
            });
        }
    };
    const getRiskData = async () => {
        const response = await fetcherPost([`read-comments/${conversation?.id}`]);
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
        if (!open) return;

        // Fetch initially
        getRiskData();

        // Set up refresh every 5 seconds
        const intervalId = setInterval(() => {
            getRiskData();
        }, 5000);

        // Clean up on unmount or when `open` changes
        return () => clearInterval(intervalId);
    }, [open]);

    useEffect(() => {
        setConversation(comments);
    }, [comments]);

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
            <Box
                sx={{
                    position: "relative",
                    flexGrow: 1,
                    mb: 2,
                    height: conversation?.invoice?.status === 'paid'
                        ? 'calc(100vh - 245px)'
                        : 'calc(100vh - 335px)',
                    overflowY: "auto",
                    pr: 1,
                    "&::-webkit-scrollbar": { display: "none" },
                    "MsOverflowStyle": "none",
                    "scrollbarWidth": "none"
                }}
            >
                <>
                    {conversation?.comments?.length < 1 ?
                        <Box>No Conversation Yet</Box>
                        :
                        <Box sx={{
                            height: "100%", overflowY: "auto", "&::-webkit-scrollbar": { display: "none" },
                            "MsOverflowStyle": "none",
                            "scrollbarWidth": "none"
                        }}>
                            {conversation?.comments?.map((msg, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: msg.user_role === "broker" ? "flex-end" : "flex-start",
                                        mb: 2,
                                        px: 1
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: msg.user_role === "broker" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                            bgcolor: msg.user_role === "broker" ? (isDark ? "#1D2630" : "white") : (isDark ? "#2e7d32cc" : "#e3f1e2ff"),
                                            boxShadow: isDark ? "0px 2px 6px rgba(255,255,255,0.1)" : "0px 2px 6px rgba(0,0,0,0.15)",
                                            maxWidth: "70%",
                                            color: isDark ? "#f5f5f5" : "#212121"
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5, color: msg.user_role === "broker" ? (isDark ? "#4dd0e1" : "#00796b") : (isDark ? "#81c784" : "#2e7d32") }}>
                                            {msg.user_role === "broker" ? "Broker" : "Provider"}
                                        </Typography>
                                        <Typography variant="body1">{msg.comment}</Typography>
                                        {msg.created_at && (
                                            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '6px' }}>
                                                <Typography variant="caption" sx={{ display: "block", mt: 0.5, fontWeight: "bold", color: isDark ? "#ddd" : "#424242" }}>
                                                    {msg.created_at &&
                                                        new Date(msg.created_at).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                            hour12: false
                                                        })
                                                    }
                                                </Typography>
                                                {msg.user_role === "broker" ?
                                                    <BiCheckDouble size={20} color={msg.is_read === 0 ? 'rgba(98, 109, 109, 1)' : 'rgba(22, 145, 216, 1)'} />
                                                    :
                                                    null
                                                }
                                            </Box>
                                        )}

                                    </Box>
                                </Box>
                            ))}
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
                    }
                </>
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

                {conversation?.status === 'close' || conversation?.status === 'resolved' || conversation?.status === 'rejected' ? (
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
                            disabled={conversation?.invoice?.status === 'paid'}
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

                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleBrokerComment}
                                disabled={conversation?.invoice?.status === 'paid'}
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

export default Conversation;
