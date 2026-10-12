import priceModel from '../models/priceModel.js';

// GET current fuel prices

export const getFuelPrice = async (req, res) => {
  try {
   const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    let fuel = await priceModel.findOne({ userId });

    // First time: create fuel price for this user
    if (!fuel) {
      fuel = await priceModel.create({
        userId: userId,
        petrol: 0,
        diesel: 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: fuel,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get fuel price"
    });
  }
};


export const updateFuelPrice = async (req, res) => {
  try {
    const { petrol, diesel } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    if (petrol === undefined && diesel === undefined) {
      return res.status(400).json({
        success: false,
        message: "Enter petrol or diesel price"
      });
    }


    if (
      petrol !== undefined &&
      (isNaN(Number(petrol)) || Number(petrol) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid petrol price"
      });
    }

    if (
      diesel !== undefined &&
      (isNaN(Number(diesel)) || Number(diesel) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid diesel price"
      });
    }

    // Find existing document
    const fuel = await priceModel.findOne({ userId });

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: "Fuel price record not found",
      });
    }

    if (petrol !== undefined) {
      fuel.petrol = Number(petrol);
    }

    if (diesel !== undefined) {
      fuel.diesel = Number(diesel);
    }
    await fuel.save();

    return res.status(200).json({
      success: true,
      message: "Fuel price updated successfully",
      data: fuel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update fuel price"
    });
  }
};
