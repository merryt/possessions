<template>
  <div
    v-if="!$apollo.queries.possession.loading"
    class="rounded border bg-gray-900 ml-2 flex"
  >
    <h1>{{ possession.name }} - {{ possession.price }}</h1>
    <p>{{ possession.description }}</p>
    <div class="images">
      <div
        class="image"
        v-for="image in possession.images"
        v-bind:key="image.url"
      >
        <img :src="image.url" :alt="image.description" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.images {
  display: flex;
}

.image {
  margin-right: 10px;
}

.image img {
  width: 300px;
}
</style>

<script>
import gql from 'graphql-tag'

export default {
  name: 'Possession',
  apollo: {
    // Dynamic querying
    possession: {
      query: gql`
        query possession($id: ID!) {
          possession(id: $id) {
            name
            description
            price
            images {
              description
              url
            }
          }
        }
      `,
      variables() {
        return {
          // if the route.params.id is null make id = 1
          id: this.$route.params.id || 1,
        }
      },
    },
  },
}
</script>
