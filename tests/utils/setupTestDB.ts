import { connect, connection, Collection, Document, disconnect } from 'mongoose';
import config from '../../src/configs';

const setupTestDB = () => {
  beforeAll(async () => {
    await connect(`${config.mongoose.url}-test`, config.mongoose.options);
  });

  beforeEach(async () => {
    await Promise.all(
      Object.values(connection.collections).map(async (collection: Collection<Document>) => collection.deleteMany())
    );
  });

  afterAll(async () => {
    await disconnect();
  });
};

export default setupTestDB;
