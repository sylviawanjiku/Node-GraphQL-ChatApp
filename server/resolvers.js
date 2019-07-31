import { PubSub, withFilter } from "graphql-yoga";
import { User, Message } from "./models";

//we’re simply searching for all items in the query category and returning them
//User or Message will return all the database entries for them.
export const resolvers = {
    Query: {
        users: () => User.find(),
    messages: () => Message.find()
    },
    //attach all messages created by a user to that same user and vice versa
    User: {
        messages: async ({ email }) => {
            return Message.find({ senderMail: email });
        }
    },
    //user responsible for sending each individual message
    Message: {
        users: async ({ senderMail }) => {
            return User.find({ email: senderMail });
          }
    },
    //pubsub.publish() function exposes a publish and subscribe API that will allow 
    //us to subscribe to additions to this field and get those fields published on the client
    Mutation: {
        createUser: async (_, { name, email }) => {
          const user = new User({ name, email });
          await user.save();
          pubsub.publish("newUser", { newUser: user });
          return user;
        },
    
        updateUser: async (_, { id, name }) => {
          const user = await User.findOneAndUpdate(
            { _id: id },
            { name },
            { new: true }
          );
          return user;
        },
    
        deleteUser: async (_, { email }) => {
          await Promise.all([
            User.findOneAndDelete({ email: email }),
            Message.deleteMany({ senderMail: email })
          ]);
          pubsub.publish("oldUser", { oldUser: email });
          return true;
        },
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter(() => pubsub.asyncIterator("newMessage"),
                (payload, variables) => {
                    return payload.receiverMail === variables.receiverMail;
                })
        },
        newUser: {
            subscribe: (_, { }, { pubsub }) => {
                return pubsub.asyncIterator("newUser");
            }
        },
        oldUser: {
            subscribe: (_, { pubsub }) => {
                return pubsub.asyncIterator("oldUser")
            }
        },
        userTyping: {
            subscribe: withFilter(
                () => pubsub.asyncIterator("userTyping"),
                (payload, variables) => {
                    return payload.receiverMail === variables.receiverMail;
                }
            )
        },
    }
};

const pubsub = new PubSub();

module.exports = resolvers;
