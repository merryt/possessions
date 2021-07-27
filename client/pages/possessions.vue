<template>
  <div>
    <h1>Randi and Tylers things</h1>
    <div v-if="!$apollo.queries.possessions.loading" class="container">
      <div class="sidebar">
        <h3>All Our stuff</h3>
        <div v-for="possession in possessions" :key="possession.id">
          <nuxt-link :to="`/possessions/${possession.id}`">
            {{ possession.name }}</nuxt-link
          >
        </div>
      </div>
      <div>
        <nuxt-child :key="$route.params.id"></nuxt-child>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 200px 3fr;
}
</style>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    possessions: gql`
      query {
        possessions {
          name
          description
          location
          price
          id
          images {
            description
            url
          }
        }
      }
    `,
  },
}
</script>
