export const getHome = (req: any, res: any) => {
    res.status(200).json({ message: 'Welcome Home.' });
};
//send aggrgation for news that have the highest views
//send news that have the highest ratings for each specific categories
