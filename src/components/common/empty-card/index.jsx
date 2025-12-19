import React from "react";
import { Card, CardContent, Typography, Box, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { HiOutlineShieldExclamation } from "react-icons/hi";

export default function EmptyCityCard({ message = "No data found", description, icon = <HiOutlineShieldExclamation size={24}/>, link, buttonText="Add New" }) {
    const navigate = useNavigate()
    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: "18px",
                width: "100%",
                minHeight: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed #cfd8dc",
                textAlign: "center",
                boxShadow: 'none',
                margin: '15px 0'
            }}
        >
            <CardContent>
                <Stack direction="column" alignItems="center" spacing={2}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            backgroundColor: "#e3f2fd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#455a64" }}>
                        {message}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        type='button'
                        onClick={()=>{navigate(link)}}
                    >
                        {buttonText}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
