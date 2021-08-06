# Possessions, a way I document what I own

To deploy api do `git subtree push --prefix api heroku master` from base level of repo

To build image run `docker build --tag possessions-api .` to build your docker image.
To run, use `docker-compose up` (app uses port 4000)

TODO:

- Setup docker for local dev.
- Performance wise I don't like how its going to the database to find every image...
- Add image upload ability
- Switch nuxt to vite-nuxt instead of webpack
- Ponder splitting this repo into two and hosting client in netlify or something

Sample mutation for adding possessions

```
mutation{
  addPossession(possession:{name: "chair",price: 10, location: STORAGE_UNIT, description: "It's a chair!", images:[
    	{ description: "picture of desk", url: "https://3.bp.blogspot.com/-DZFnyzm65yA/UrB6z86DY5I/AAAAAAAAH3E/W8-EjkjjuOw/s1600/Orange_Tweed_Danish_Lounge_Chair_6.JPG"},
  	]}){
    name
    description
    location
    price
    images{
      url
      description
    }
  }
}
```

sample querys for possessions

```
query{
  possession(id: "60fb42a6cc07cd9c3407443c"){
    name
    description
    location
    price
    id
    images{
      description
      url
    }
  }
}

```

```
query{
  possessions{
    name
    description
    location
    price
    id
    images{
      description
      url
    }
  }
}
```
