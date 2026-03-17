function transform(input) {
  var me         = input.IDX_0 || {};
  var stats      = input.IDX_2 || {};
  var inProgress = input.IDX_3 || {};

  // Build progress lookup from me.mediaProgress keyed by libraryItemId
  var progressMap = {};
  (me.mediaProgress || []).forEach(function(p) {
    progressMap[p.libraryItemId] = p;
  });

  var sessions = ((input.IDX_1 || {}).sessions || []).slice(0, 20).map(function(s) {
    return {
      date:          s.date,
      displayTitle:  s.displayTitle,
      timeListening: s.timeListening
    };
  });

  var libraryItems = (inProgress.libraryItems || []).map(function(item) {
    var media = item.media || {};
    var meta  = media.metadata || {};
    var prog  = item.userMediaProgress || progressMap[item.id] || {};
    return {
      id: item.id,
      media: {
        duration: media.duration,
        metadata: {
          title:      meta.title,
          authorName: meta.authorName
            || (meta.authors && meta.authors[0] && meta.authors[0].name)
            || ''
        }
      },
      userMediaProgress: {
        currentTime:               prog.currentTime,
        hideFromContinueListening: prog.hideFromContinueListening
      }
    };
  });

  return { data: {
    me: {
      username: me.username,
      token:    me.token
    },
    listening_sessions: { sessions: sessions },
    listening_stats: {
      days:             stats.days,
      today:            stats.today,
      numItemsFinished: stats.numItemsFinished
    },
    items_in_progress: { libraryItems: libraryItems }
  }};
}
