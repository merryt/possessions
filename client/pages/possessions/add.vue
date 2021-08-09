<template>
  <div class="inputContainer">
    <label for="name">Item Name</label>
    <input type="text" id="name" placeholder="Name" v-model="name" />
    <label for="price">Item Price (0 for free)</label>
    <input
      type="number"
      id="price"
      placeholder="How many Doll Hairs we trying to get"
      v-model="price"
    />
    <label for="description">Item Description</label>
    <textarea
      name="description"
      id="description"
      cols="30"
      rows="10"
      placeholder="Description"
      v-model="description"
    ></textarea>
    <div class="images">
      <input
        v-for="(image, index) in images"
        v-bind:key="index"
        :data-index="index"
        @change="updateImage"
        type="file"
      />
    </div>
    <button @click="images.push({})">add image</button>
    <!-- <input @change="upload" type="file" />
    {{ imgData }} -->
    <button @click="addPossession" class="bigBtn">Submit</button>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data() {
    return {
      images: [{}],
      name: '',
      description: '',
      price: '',
      imgData: '',
    }
  },
  methods: {
    upload({ target: { files = [] } }) {
      if (!files.length) {
        return
      }
      console.log(files)

      this.$apollo
        .mutate({
          mutation: gql`
            mutation uploadPhoto($image: Upload!) {
              addImage(image: $image) {
                filename
              }
            }
          `,
          variables: {
            image: files[0],
          },
          context: {
            hasUpload: true,
          },
        })
        .then(({ data }) => {
          this.imgData = data
        })
    },
    updateImage({ target }) {
      this.images[target.getAttribute('data-index')] = target.files[0]
      console.log(target.files[0])
    },
    addPossession() {
      console.log(this.images)
      this.$apollo.mutate({
        mutation: gql`
          mutation createPossession(
            $name: String!
            $price: Int!
            $description: String!
            $image: [ImageInput]
          ) {
            addPossession(
              possession: {
                name: $name
                price: $price
                description: $description
                images: $image
              }
            ) {
              name
              price
              description
            }
          }
        `,
        variables: {
          image: this.images,
          name: this.name,
          price: parseInt(this.price),
          description: this.description,
        },
        context: {
          hasUpload: true,
        },
      })
      return true
    },
  },
}
</script>

<style scoped>
.inputContainer,
.images {
  display: flex;
  flex-direction: column;
}

.images > *,
.inputContainer > * {
  margin-bottom: 10px;
}

.bigBtn {
  width: 100%;
  margin-top: 10px;
  background-color: aquamarine;
  outline: none;
  padding: 10px;
  border-radius: 10px;
}
</style>
