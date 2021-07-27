<template>
  <div>
    <header>
      <div class="header-inner"><h1>Randi and Tylers things</h1></div>
    </header>

    <div v-if="!$apollo.queries.possessions.loading" class="container">
      <div class="cards">
        <div
          v-for="possession in possessions"
          :key="possession.id"
          class="card"
        >
          <div class="card-image-container">
            <img
              class="card-image"
              :src="possession.images[0].url"
              :alt="possession.images[0].description"
            />
          </div>
          <div class="card-body">
            <h4>{{ possession.name }}</h4>
            <h5>{{ possession.price }}</h5>
            <nuxt-link class="read-more" :to="`/possessions/${possession.id}`">
              Learn more</nuxt-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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

<style scoped>
header {
  color: #fff;
  background: #090a0b no-repeat 50%;
  background-image: url(http://travelsaveandbemerry.com/content/images/2017/01/cover-photo.jpg);
  position: relative;
  padding: 12px 4vw;
  background-size: cover;
  z-index: -1;
}

.header-inner {
  padding: 6vw 4vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cards {
  width: 80%;
  max-width: 1035px;
  margin: -40px auto 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}

.card {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ccc;
  height: 300px;
}

.card-image-container {
  overflow: hidden;
  height: 200px;
  display: flex;
  align-items: center;
}
.card-image {
  width: 100%;
}
.card-body {
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
.card-body h5,
.card-body h4 {
  margin-top: 5px;
}
</style>
