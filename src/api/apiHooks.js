import axios from "axios";
import * as ApiRoutes from "./apiServices.js";

export const getExpenses = async (params) => {
  try {
    const response = await axios({
      method: "get",
      url: ApiRoutes.getExpenses,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios({
      method: "get",
      url: ApiRoutes.getCategories,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createExpense = async (body, idempotencyKey) => {
  try {
    const response = await axios({
      method: "post",
      url: ApiRoutes.createExpense,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      data: body,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};
