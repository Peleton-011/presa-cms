<template>
    <div>
      <h1>Welcome Back!</h1>
      <p>You are signed in.</p>
    </div>
  </template>
  
  <script>
  import { useAuth } from '@clerk/vue';
  
  export default {
    setup() {
      const { user } = useAuth();
  
      return { user };
    },
  };
  </script>
  