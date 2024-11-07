import { Request, Response } from "express";
import fs from "fs";
import { IApparel } from "../models/Apparel";

const dataFilePath = "./src/data/data.json";

const readData = (): IApparel[] => {
  const data = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(data);
};

const writeData = (data: IApparel[]): void => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
};

// Error handling utility
const handleError = (res: Response, error: any) => {
  res.status(500).json({ error: error.message });
};

// Create a new apparel
export const createApparel = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, size, quantity, price } = req.body;
  console.log("create apparel", code, size, quantity, price);
  if (!code || !size || quantity === undefined || price === undefined) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const data = readData();
    const existingApparel = data.find(
      (item) => item.code === code && item.size === size
    );
    if (existingApparel) {
      res
        .status(400)
        .json({ error: "Apparel with this code and size already exists" });
      return;
    }
    const newApparel: IApparel = { code, size, quantity, price };
    data.push(newApparel);
    writeData(data);
    res.status(201).json(newApparel);
  } catch (error) {
    handleError(res, error);
  }
};

// Update stock and price for one apparel
export const updateApparel = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, size, quantity, price } = req.body;

  if (!code || !size || quantity === undefined || price === undefined) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const data = readData();
    const index = data.findIndex(
      (item) => item.code === code && item.size === size
    );

    if (index !== -1) {
      data[index] = { code, size, quantity, price };
    } else {
      data.push({ code, size, quantity, price });
    }

    writeData(data);
    res.status(200).json(data[index]);
  } catch (error) {
    handleError(res, error);
  }
};

// Update stock and price for multiple apparels
export const updateMultipleApparels = async (
  req: Request,
  res: Response
): Promise<void> => {
  const apparels: IApparel[] = req.body;

  if (!Array.isArray(apparels)) {
    res.status(400).json({ error: "Invalid input format" });
    return;
  }

  try {
    const data = readData();

    apparels.forEach(({ code, size, quantity, price }) => {
      const index = data.findIndex(
        (item) => item.code === code && item.size === size
      );
      if (index !== -1) {
        data[index] = { code, size, quantity, price };
      } else {
        data.push({ code, size, quantity, price });
      }
    });

    writeData(data);
    res.status(200).json(data);
  } catch (error) {
    handleError(res, error);
  }
};

// Check if an order can be fulfilled
export const checkOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { order } = req.body;

  if (!Array.isArray(order)) {
    res.status(400).json({ error: "Invalid input format" });
    return;
  }

  try {
    const data = readData();
    const canFulfill = order.every(({ code, size, quantity }) => {
      const apparel = data.find(
        (item) => item.code === code && item.size === size
      );
      return apparel && apparel.quantity >= quantity;
    });

    res.status(200).json({ canFulfill });
  } catch (error) {
    handleError(res, error);
  }
};

// Get the lowest cost for an order
export const lowestCost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { order } = req.body;

  if (!Array.isArray(order)) {
    res.status(400).json({ error: "Invalid input format" });
    return;
  }

  try {
    const data = readData();
    const totalCost = order.reduce((acc, { code, size, quantity }) => {
      const apparel = data.find(
        (item) => item.code === code && item.size === size
      );
      if (apparel && apparel.quantity >= quantity) {
        return acc + apparel.price * quantity;
      }
      throw new Error(`Cannot fulfill item: ${code}, size: ${size}`);
    }, 0);

    res.status(200).json({ lowestCost: totalCost });
  } catch (error) {
    handleError(res, error);
  }
};
