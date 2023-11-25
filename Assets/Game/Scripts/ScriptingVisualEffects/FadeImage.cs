using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class FadeImage : MonoBehaviour{



    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }


    public static IEnumerator Fade(Image image, Color initial, Color final, float time) {

        image.gameObject.SetActive(true);
        image.color = Color.Lerp(initial, final, time);

        yield return new WaitForSeconds(time);

        image.gameObject.SetActive(false);

    }
}
