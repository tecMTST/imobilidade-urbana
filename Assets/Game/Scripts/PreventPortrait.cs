using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PreventPortrait : MonoBehaviour
{

    RectTransform rectTransform;
    public GameObject dontPortraitPanel;

    // Start is called before the first frame update
    void Start()
    {
        rectTransform = GetComponent<RectTransform>();
        PreventPortraitLayout();
        
    }

    

    private void OnRectTransformDimensionsChange() {

        PreventPortraitLayout();
    }

    

    private void PreventPortraitLayout() {

        try {
            if (rectTransform.sizeDelta.x > rectTransform.sizeDelta.y) {
                if (GameObject.FindGameObjectWithTag("DontPortrait")) {
                    foreach (GameObject gameObject in GameObject.FindGameObjectsWithTag("DontPortrait"))
                        Destroy(gameObject);
                }

                Time.timeScale = 1.0f;
            } else {
                if (!GameObject.FindGameObjectWithTag("DontPortrait"))
                    Instantiate(dontPortraitPanel, rectTransform);

                Time.timeScale = 0;
            }
        } catch {}
    }
}
