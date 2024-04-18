import {
    Box,
    Text,
    IconButton,
} from '@chakra-ui/react';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    setShowSignupPopup: (value: boolean) => void;
}
export default function SignupPopup({ setShowSignupPopup }: Props) {
    const closeSignUp = () => {
        setShowSignupPopup(false);
    };

    return (
        <Box
            className="outermost-box"
            position="absolute"
            top="150%"
            left="10%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="#D9D9D9"
            width="80%"
            height="220%"
            zIndex={'200'}
        >
            <IconButton
                aria-label="close"
                size="small"
                position="absolute"
                top="10px"
                right="10px"
                onClick={closeSignUp}
            >
                <CloseIcon />
            </IconButton>
            <Box
                className="inner-box"
                bg="#FFFDFD"
                height="80%"
                width="80%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-evenly"
            >
                <Text
                    fontFamily="Montserrat"
                    fontSize="25px"
                    fontWeight={600}
                    color='black'
                    padding="20px"
                >
                    Please navigate to the map below and select a site that you would like to adopt in order to start the sign up process.
                </Text>
            </Box>
        </Box>
    );
}