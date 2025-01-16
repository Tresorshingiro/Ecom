const Type = require('../models/typeModel')

const createType = async (req, res) => {
    const { name, description } = req.body;

    try {
        const type = await Type.create({ name, description });
        res.status(201).json(type);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all types
const getAllTypes = async (req, res) => {
    try {
        const types = await Type.find();
        res.status(200).json(types);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a type by ID
const getTypeById = async (req, res) => {
    const { id } = req.params;

    try {
        const type = await Type.findById(id);
        if (!type) {
            return res.status(404).json({ error: 'Type not found' });
        }
        res.status(200).json(type);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a type
const updateTypeById = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const type = await Type.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!type) {
            return res.status(404).json({ error: 'Type not found' });
        }
        res.status(200).json(type);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a type
const deleteTypeById = async (req, res) => {
    const { id } = req.params;

    try {
        const type = await Type.findByIdAndDelete(id);
        if (!type) {
            return res.status(404).json({ error: 'Type not found' });
        }
        res.status(200).json({ message: 'Type deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createType,
    getAllTypes,
    getTypeById,
    updateTypeById,
    deleteTypeById
};