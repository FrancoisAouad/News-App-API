export const getHome = (req: any, res: any) => {
    res.status(200).json({ message: 'Welcome Home.' });
};
