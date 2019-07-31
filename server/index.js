//create an instance of our server,PubSub and withFilter will be used for the GraphQL 
//subscriptions that will make our app real-time
//TypeDefs define the schema models we want and specify what each model should contain.
//define the structure of the GraphQL API and are written in GraphQL SDL & GraphQL operation types 
//queries, mutations, and subscriptions.
// Queries are used for requesting data. They perform the R-Read in the CRUD functions
//Mutations allow us to modify data on our models -C-Create, U-Update and D-Delete function
//Subscriptions, on the other hand, are used to create and maintain a real-time connection with the server. 

const express = require('express');
const { PubSub, GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose")
const typeDefs = require("./typeDefs")
const resolvers = require("./resolvers")


const expressPlayground = require('graphql-playground-middleware-express')
    .default
const opts = {
    port: 4000,
    endpoint: '/graphql'
}
const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, opts, context: { pubsub }  });
server.express.use(express());

server.express.use('/playground', expressPlayground({ endpointUrl: '/graphql' }))

mongoose.connect("mongodb+srv://sly:<sly!23>@e-commerce-vjqdq.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true, useFindAndModify: false,
    useCreateIndex: true
},
    () =>
        server.start(() => console.log(`😄 Server running at http://localhost:${opts.port}${opts.endpoint}`)
        ))
    .catch(err => {
        console.log(err);
    });









