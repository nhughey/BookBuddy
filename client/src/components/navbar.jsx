// client/src/components/Navbar.jsx
import { Box, Flex, Button, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');

  return (
    <Box bg="blue.500" px={4} py={3}>
      <Flex maxW="1200px" mx="auto" justify="space-between" align="center">
        <Link to="/">
          <Text color="white" fontWeight="bold">BookBuddy</Text>
        </Link>
        <Flex gap={4}>
          {token ? (
            <Button 
              colorScheme="red" 
              size="sm" 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button colorScheme="blue" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button colorScheme="green" size="sm">Register</Button>
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;