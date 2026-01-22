import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Authors, Games, Reviews } from "./db";
import { typeDefs } from "./schema";

const resolvers = {
  Query: {
    games() {
      return Games;
    },
    reviews() {
      return Reviews;
    },
    authors() {
      return Authors;
    },
    review(_, args) {
      return Reviews.find((review) => review.id === args.id);
    },
    game(_, args) {
      return Games.find((game) => game.id === args.id);
    },
    author(_, args) {
      return Authors.find((author) => author.id === args.id);
    },
  },
  Mutation: {
    deleteGame(_, args) {
      const res = Games.filter((el) => el.id !== args.id);
      return res;
    },
    addGame(_, args) {
      const game = {
        ...args.game,
        id: Math.floor(Math.random() * 100000).toString(),
      };
      Games.push(game);
      return game;
    },
    game(_, args) {
      Games.map((game) => {
        if (game.id === args.id) {
          return { ...game, ...args.edit };
        }
        return game;
      });
      return Games.find((g) => g.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
      return Reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return Reviews.filter((r) => r.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return Authors.find((a) => a.id === parent.author_id);
    },
    game(parent) {
      return Games.find((a) => a.id === parent.game_id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const { url } = await startStandaloneServer(server, {
  listen: { port: 8000 },
});

console.log(url, "url");
