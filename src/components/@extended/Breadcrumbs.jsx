import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from '@mui/material/styles';
import { capitalize } from "lodash";

// Function to check if a segment is an ID (numeric)
const isID = (segment) => /^\d+$/.test(segment);

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
}));

const BreadcrumbNav = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const pathnames = location.pathname.split("/").filter((x) => x);

    const topLevel = pathnames[0] || 'Home';

    const handleClick = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    return (
        <>
            <Typography sx={{ fontSize: '24px', fontWeight: '600', marginBottom: '5px' }}>
                {capitalize(topLevel)}
            </Typography>

            <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: '10px' }}>
                <StyledLink to="/" color={theme.palette.primary.main}>
                    Home
                </StyledLink>

                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathnames.length - 1;

                    if (isID(value)) {
                        return (
                            <Typography key={to} color="text.secondary">
                                {value}
                            </Typography>
                        );
                    }

                    return isLast ? (
                        <Typography key={to} color="text.primary">
                            {capitalize(value)}
                        </Typography>
                    ) : (
                        value === "trips" ? (
                            <StyledLink as="button" sx={{border:'none', background:'transparent', cursor:'pointer'}} onClick={handleClick}>
                                {capitalize(value)}
                            </StyledLink>
                        ) : (
                            <StyledLink key={to} to={to}>
                                {capitalize(value)}
                            </StyledLink>
                        )
                    );
                })}
            </Breadcrumbs >
        </>
    );
};

export default BreadcrumbNav;
