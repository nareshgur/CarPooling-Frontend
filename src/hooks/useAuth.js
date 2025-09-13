// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { restoreAuth } from '../store/slices/authSlice';

// export const useAuth = () => {
//   const dispatch = useDispatch();
//   const { isAuthenticated, user, token } = useSelector(state => state.auth);

//   useEffect(() => {
//     // Check if we have stored auth data on app initialization
//     const storedToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');
    
//     if (storedToken && storedUser && !isAuthenticated) {
//       try {
//         const userData = JSON.parse(storedUser);
//         dispatch(restoreAuth({ user: userData, token: storedToken }));
//       } catch (error) {
//         console.error('Error restoring auth state:', error);
//         // Clear invalid stored data
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       }
//     }
//   }, [dispatch, isAuthenticated]);

//   return { isAuthenticated, user, token };
// };
