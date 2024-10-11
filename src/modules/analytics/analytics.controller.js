import userModel from "../../../db/models/user.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import productModel from './../../../db/models/product.model.js';
import { AppError } from './../../utils/classError.js';
import orderModel from './../../../db/models/order.model.js';

// ================================  AnalyticsData ================================================

export const AnalyticsData = asyncHandler(async (req, res, next) => {
    const analyticsData = await getAnalyticsData();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySalesData = await getDailySalesData(startDate, endDate);
    res.json({
        analyticsData,
        dailySalesData,
    });
})

export const getAnalyticsData =asyncHandler(async () => {
	const totalUsers = await userModel.countDocuments();
	const totalProducts = await productModel.countDocuments();

	const salesData = await orderModel.aggregate([
		{
			$group: {
				_id: null, // it groups all documents together,
				totalSales: { $sum: 1 },
				totalRevenue: { $sum: "$totalAmount" },
			},
		},
	]);

	const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

	return {
		users: totalUsers,
		products: totalProducts,
		totalSales,
		totalRevenue,
	};
});

export const getDailySalesData =  asyncHandler(async (startDate, endDate) => {
		const dailySalesData = await orderModel.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					sales: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{ $sort: { _id: 1 } },
		]);


		const dateArray = getDatesInRange(startDate, endDate);

		return dateArray.map((date) => {
			const foundData = dailySalesData.find((item) => item._id === date);

			return {
				date,
				sales: foundData?.sales || 0,
				revenue: foundData?.revenue || 0,
			};
		});
});

function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
}
