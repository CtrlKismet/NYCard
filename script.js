let initMatrixNumber = [3, 7, 8, 9, 10, 12, 14, 16, 17, 20, 22, 24, 28, 30, 32, 34, 38, 40, 42, 45, 46, 48, 50, 52, 53, 54, 56, 58, 60, 64, 66, 68, 70, 74, 75, 79];

let ansMatrixNumber = [2, 4, 3, 5, 6, 7, 8, 9, 1, 5, 6, 1, 2, 8, 9, 4, 3, 7, 7, 8, 9, 1, 4, 3, 6, 2, 5, 3, 1, 2, 4, 5, 8, 7, 6, 9, 6, 5, 7, 9, 3, 1, 2, 4, 8, 4, 9, 8, 6, 7, 2, 1, 5, 3, 8, 2, 6, 7, 9, 5, 3, 1, 4, 9, 3, 4, 8, 1, 6, 5, 7, 2, 1, 7, 5, 3, 2, 4, 9, 8, 6];

let matrixNumberCount = [0, 9, 9, 9, 9, 9, 9, 9, 9, 9];

let vuec_matrixNum = {
    props: {
        block: {
            type: Object,
            default: {
                row: 0,
                col: 0,
                num: 0,
                res: 0,
                blk: 0,
                r_border: 0,
                b_border: 0,
                isModify: true
            }
        },
        now_num: Number,
        now_r: Number,
        now_c: Number,
        now_b: Number
    },
    template: '<div class="num" :class="[{rl_border:block.r_border===1},{rh_border:block.r_border===2},{bl_border:block.b_border===1},{bh_border:block.b_border===2},{choosed:block.row===now_r&&block.col===now_c},{highlight_area:block.row===now_r||block.col===now_c||block.blk===now_b},{highlight_number:block.num!==0&&block.num===now_num},{blocked:!block.isModify},{error_number:block.num!==block.res}]" @click="select">{{block.num===0 ? "" : block.num}}</div>',
    methods: {
        select() {
            this.$emit('select-number', {
                r: this.block.row,
                c: this.block.col,
                num: this.block.num,
                block: this.block.blk
            })
        }
    }
};


let vuec_test = {
    template: '<div style="background-color:red;height:100%" @click="select"></div>',
    methods: {
        select() {
            this.$emit('select-number', {
                r: 1,
                c: 1
            })
        }
    }
};

let matrix = new Vue({
    el: '#matrix',
    data: {
        nums: [],
        now_row: 0,
        now_col: 0,
        now_number: 0,
        now_block: 0
    },
    components: {
        'matrix-num': vuec_matrixNum,
        // 'test': vuec_test
    },
    mounted: function () {
        let t_nums = [],
            right_border = 0,
            bottom_border = 0;
        for (let index = 0; index < 81; index++) {

            if (index % 9 === 2 || index % 9 === 5) right_border = 2;
            else if (index % 9 !== 8) right_border = 1;
            else right_border = 0;

            if (parseInt(index / 9) === 2 || parseInt(index / 9) === 5) bottom_border = 2;
            else if (parseInt(index / 9) !== 8) bottom_border = 1;
            else bottom_border = 0;

            t_nums.push(new Object({
                id: index,
                row: parseInt(index / 9 + 1),
                col: parseInt(index % 9 + 1),
                r_border: right_border,
                b_border: bottom_border,
                num: ansMatrixNumber[index],
                res: ansMatrixNumber[index],
                blk: parseInt(index / 27) * 3 + parseInt((index % 9) / 3) + 1,
                isModify: false,
                highlightArea: false
            }));
        }

        for (idx of initMatrixNumber) {
            matrixNumberCount[t_nums[idx].num]--;
            t_nums[idx].num = 0;
            t_nums[idx].isModify = true;
        }

        this.nums = t_nums;
    },
    methods: {
        ChangeNum: function (value) {
            this.now_row = value.r;
            this.now_col = value.c;
            this.now_number = value.num;
            this.now_block = value.block;
            console.log(value)
        },
        FillNumber: function (number, modify = true) {
            let idx = this.now_idx;
            if (idx < 0) return;
            let status = this.nums[idx];
            if (!status.isModify) return;
            if (!modify) number = ansMatrixNumber[idx];
            matrixNumberCount[status.num]--;
            status.num = number;
            status.isModify = modify;
            matrixNumberCount[number]++;
            Vue.set(this.nums, idx, status);
            this.now_number = number;
        }
    },
    computed: {
        now_idx: function () {
            return this.now_row * 9 + this.now_col - 10;
        },
        show_fill_number() {
            return function (num) {
                return matrixNumberCount[num] < 9;
            }
        }
    }
});