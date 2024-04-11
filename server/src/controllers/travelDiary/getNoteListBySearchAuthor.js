const { TravelNote } = require('../../models/travelNoteModel');
const { runtimeLog } = require('../../utils/logger');
const { getVideoCover } = require('../../utils/getVideoCover');
const { videoCoverCache } = require('../../utils/videoCoverCache');

const clipCover = async function (url) {
    const result = videoCoverCache.get(url);
    if (result !== -1) {
        return result;
    } else {
        const cvr = await getVideoCover(url);
        videoCoverCache.put(url, cvr);
        return cvr;
    }
};

const getNoteListBySearchAuthor = async function (req, res) {
    try {
        const { listLength, authorNickname } = req.data;
        let rows;
        if (req.data.beforeWhen) {
            const { beforeWhen } = req.data;
            rows = await TravelNote.getNoteListSearchNicknameByTime(beforeWhen, authorNickname, listLength);
        } else if (req.data.beforeNoteId) {
            const { beforeNoteId } = req.data;
            rows = await TravelNote.getNoteListSearchNicknameById(beforeNoteId, authorNickname, listLength);
        } else {
            throw new Error('No noteid nor beforewhen received.');
        }

        const noteList = await Promise.all(rows.map(async obj => {
            if (obj.mediaType === 'video') {
                const coverImg = await clipCover(obj.url);
                return {
                    ...obj,
                    title: noteTitle,
                    coverImg,
                    authorNickname: nickname,
                    authorAvatar: avatar
                };
            }
        }));

        res.send({
            status: 200,
            noteList
        });

    } catch (error) {
        console.error('Error fetching data:', error.message);
        runtimeLog.error('Error fetching data:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getNoteListBySearchAuthor };
