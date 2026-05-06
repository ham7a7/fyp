// src/types/express-custom.d.ts

import type { IBotModel } from "./botModel.ts";
import type { IIntentModel } from "./intentModel.ts";

// Augment the 'express-serve-static-core' module where Request is defined
declare module "express-serve-static-core" {
  interface Request {
    bot?: IBotModel;
    intent?:IIntentModel
  }
}

// NOTE: You do not need to import this file anywhere.
// TypeScript automatically detects files ending in .d.ts in your project.
