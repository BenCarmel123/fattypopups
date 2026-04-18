import { getAllChefs } from '../services/entities/chef/operations.js';

export const getChefs = async (_req, res, next) => {
  try {
    const chefs = await getAllChefs();
    res.json(chefs.map(chef => ({
      name: chef.name,
      instagram: chef.instagram_handle
    })));
  } catch (err) {
    next(err);
  }
};
