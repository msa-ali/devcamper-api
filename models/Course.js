const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a course description'],
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of week'],
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost'],
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    }
});
// Static method to get average of course tuitions in a bootcamp
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    console.log('Calculating average cost'.blue);

    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: { 
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
             }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: obj && obj[0] ? Math.ceil(obj[0].averageCost/10)*10 : 0
        })
    } catch (error) {
        console.error(error);
    }
};

// call getAverageCost after save
CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

// call getAverageCost before remove
CourseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);